import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";



actor {
  // Types
  type CategoryId = Nat;
  type WorkId = Nat;
  type CertificateId = Nat;

  public type UserProfile = {
    name : Text;
  };

  public type PortfolioCategory = {
    id : CategoryId;
    name : Text;
    description : Text;
  };

  public type PhotographyWork = {
    id : WorkId;
    title : Text;
    description : Text;
    imageUrl : Text;
    categoryId : CategoryId;
  };

  public type Certificate = {
    id : CertificateId;
    title : Text;
    issuingOrganization : Text;
    issueDate : Text;
    credentialUrl : Text;
  };

  // Internal state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextCategoryId = 1;
  var nextWorkId = 1;
  var nextCertificateId = 1;

  let categories = Map.empty<CategoryId, PortfolioCategory>();
  let works = Map.empty<WorkId, PhotographyWork>();
  let certificates = Map.empty<CertificateId, Certificate>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Category Management
  public shared ({ caller }) func createCategory(name : Text, description : Text) : async CategoryId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create categories");
    };

    let id = nextCategoryId;
    nextCategoryId += 1;

    let category : PortfolioCategory = {
      id;
      name;
      description;
    };

    categories.add(id, category);
    id;
  };

  public shared ({ caller }) func editCategory(id : CategoryId, name : Text, description : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit categories");
    };

    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        let updatedCategory : PortfolioCategory = {
          id;
          name;
          description;
        };
        categories.add(id, updatedCategory);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete categories");
    };

    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?_) {
        categories.remove(id);
        // Also remove works associated with this category
        let worksToRemove = works.filter(
          func(_workId, work) {
            work.categoryId == id;
          }
        );
        for ((workId, _) in worksToRemove.entries()) {
          works.remove(workId);
        };
      };
    };
  };

  // Photography Works Management
  public shared ({ caller }) func addPhotographyWork(title : Text, description : Text, imageUrl : Text, categoryId : CategoryId) : async WorkId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add works");
    };

    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Invalid categoryId") };
      case (?_) {
        let id = nextWorkId;
        nextWorkId += 1;

        let work : PhotographyWork = {
          id;
          title;
          description;
          imageUrl;
          categoryId;
        };

        works.add(id, work);
        id;
      };
    };
  };

  public shared ({ caller }) func editPhotographyWork(id : WorkId, title : Text, description : Text, imageUrl : Text, categoryId : CategoryId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit works");
    };

    switch (categories.get(categoryId)) {
      case (null) { Runtime.trap("Invalid categoryId") };
      case (?_) {
        switch (works.get(id)) {
          case (null) { Runtime.trap("Work not found") };
          case (?_) {
            let updatedWork : PhotographyWork = {
              id;
              title;
              description;
              imageUrl;
              categoryId;
            };
            works.add(id, updatedWork);
          };
        };
      };
    };
  };

  public shared ({ caller }) func deletePhotographyWork(id : WorkId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete works");
    };

    switch (works.get(id)) {
      case (null) { Runtime.trap("Work not found") };
      case (?_) {
        works.remove(id);
      };
    };
  };

  // Certificates Management
  public shared ({ caller }) func addCertificate(title : Text, issuingOrganization : Text, issueDate : Text, credentialUrl : Text) : async CertificateId {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add certificates");
    };

    let id = nextCertificateId;
    nextCertificateId += 1;

    let certificate : Certificate = {
      id;
      title;
      issuingOrganization;
      issueDate;
      credentialUrl;
    };

    certificates.add(id, certificate);
    id;
  };

  public shared ({ caller }) func editCertificate(id : CertificateId, title : Text, issuingOrganization : Text, issueDate : Text, credentialUrl : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can edit certificates");
    };

    switch (certificates.get(id)) {
      case (null) { Runtime.trap("Certificate not found") };
      case (?_) {
        let updatedCertificate : Certificate = {
          id;
          title;
          issuingOrganization;
          issueDate;
          credentialUrl;
        };
        certificates.add(id, updatedCertificate);
      };
    };
  };

  public shared ({ caller }) func deleteCertificate(id : CertificateId) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can delete certificates");
    };

    switch (certificates.get(id)) {
      case (null) { Runtime.trap("Certificate not found") };
      case (?_) {
        certificates.remove(id);
      };
    };
  };

  // Public Queries
  public query func getAllCategories() : async [PortfolioCategory] {
    categories.values().toArray();
  };

  public query func getAllWorks() : async [PhotographyWork] {
    works.values().toArray();
  };

  public query func getWorksByCategory(categoryId : CategoryId) : async [PhotographyWork] {
    let filteredWorks = works.filter(
      func(_id, work) {
        work.categoryId == categoryId;
      }
    );
    let iter = filteredWorks.values();
    iter.toArray();
  };

  public query func getAllCertificates() : async [Certificate] {
    certificates.values().toArray();
  };
};
